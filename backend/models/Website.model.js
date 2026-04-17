import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    description:     { type: String, default: '' },
    longDescription: { type: String, default: '' },
    images:          [{ type: String }],
    techStack:       [{ type: String }],
    liveUrl:         { type: String, default: '' },
    githubUrl:       { type: String, default: '' },
    status:          { type: String, enum: ['Live', 'Beta', 'Archived'], default: 'Live' },
    order:           { type: Number, default: 0 },
    visitors:        { type: Number, default: 0 },
    featured:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Website', websiteSchema);
